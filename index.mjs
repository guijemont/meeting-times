#!/usr/bin/env node
// Copyright © Igalia, S.L. 2023

import { Temporal } from "@js-temporal/polyfill"

if (process.argv.length < 7)
    throw new Error(`Syntax: node ${process.argv[1]} <date> <time> <duration> <timeZone1> <timeZone2> [timeZones...]`);

const meetingDate = Temporal.PlainDate.from(process.argv[2]);
const meetingTime = Temporal.PlainTime.from(process.argv[3]);
const meetingDuration = Temporal.Duration.from(`PT${process.argv[4]}`);
const timeZones = process.argv.slice(5).map(Temporal.TimeZone.from);
const mainTimeZone = timeZones[0];
const ourLocale = 'en-US';

const meetingStart = meetingDate.toZonedDateTime({
    timeZone: mainTimeZone,
    plainTime: meetingTime,
});

// these next 3 functions modified from https://git.disroot.org/ryzokuken/tc39-times
function localSpan (tz) {
    const time = meetingStart.withTimeZone(tz);
    return [time, time.add(meetingDuration)];
}

const formatOptions = {
    hour: "numeric",
    minute: "2-digit",
}

function formatSpan(span) {
    return `${span[0].toLocaleString(
        ourLocale,
        formatOptions
    )} to ${span[1].toLocaleString(ourLocale, {
        ...formatOptions,
        timeZoneName: "long",
    })}`
}

for (const tz of timeZones) {
    console.log(formatSpan(localSpan(tz)));
}
