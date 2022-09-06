import { toast } from 'https://cdn.skypack.dev/wc-toast'
import countries from './countries.json' assert { type: "json"};

const $ = selector => document.querySelector(selector)

function changeTimeZone (date, timeZone) {
    const dateToUse = typeof date === 'string'
    ? new Date(date)
    : date


    return new Date(dateToUse.toLocaleString('en-US', {
        timeZone
    }))
}

const transformDateToString = (date) => {
    const localeDate = date.toLocaleString('es-ES', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric'
    })

    return localeDate.replace(':00',' h')
}


const $form = $('form')
const $textarea = $('textarea')


$form.addEventListener("submit", (event) => {
    event.preventDefault()
    const {date} = Object.fromEntries(new window.FormData($form))

    const mainDate = new Date(date)
    const times = {}

    countries.forEach(country =>{
        const {country_code:code, name, timezones} = country
        const [timezone] = timezones

        const dateInTimeZone = changeTimeZone(mainDate, timezone)
        const hour = dateInTimeZone.getHours()

        times[hour] ??= []

        times[hour].push({
            date: dateInTimeZone,
            code,
            name,
            timezones
        })
        
    })

    const sortedTimes =
        Object.entries(times).sort(([timeA], [timeB]) => +timeB - +timeA)

    const html = sortedTimes.map(([, countries]) => {
        const flags = countries.map(country => `${country.name}`).join(' ')
        const [country] = countries
        const {date, timezones} = country
        const [firstTimeZone] = timezones
        return `${flags} ${transformDateToString(date)}`
    }).join('\n')

    // copiar en el portapapeles
    navigator.clipboard.writeText(html)
        .then(() =>{
            toast('Copiado al portapapeles', {
                icon: {
                    type: 'success'
                }
            })
        })


    $textarea.value = html


})

