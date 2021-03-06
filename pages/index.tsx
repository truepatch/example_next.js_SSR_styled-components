import Head from 'next/head';
import { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import RadioGroup from '../components/RadioGroup';
import SvgElement from '../components/SvgElement';
import { parseISO, differenceInMinutes } from 'date-fns';
import { format, zonedTimeToUtc } from 'date-fns-tz';

const GlobalStyle = createGlobalStyle`
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
body {
    font-family: 'Inter', sans-serif;
    font-weight: lighter;
}
a {
    text-decoration: none;
    cursor: pointer;
}
a:hover {
    text-decoration: underline;
}
`;
const Container = styled.div`
    max-width: 1200px;
    margin: 50px auto;
`;
const ButtonsBlock = styled.div`
    display: flex;
    justify-content: center;
`;
const SvgBlock = styled.div`
    display: flex;
    margin: 100px auto;
    justify-content: center;
`;

interface IEvent {
    start: string | Date;
    end: string | Date;
    summary: string;
}
interface IElement {
    start?: Date;
    end?: Date;
    height?: number;
    text?: string;
}

export default function Index({ timezones, events }: any) {
    const [timezone, setTimezone] = useState<string>('');
    const [event, setEvent] = useState<IEvent>();
    const [element, setElement] = useState<IElement>();

    useEffect(() => {
        if (event && timezone) {
            let start = zonedTimeToUtc(new Date(event.start), timezone);
            let end = zonedTimeToUtc(new Date(event.end), timezone);
            let height = Math.ceil(differenceInMinutes(end, start) / 30) * 39;
            console.log(
                'start \n',
                new Date(event.start) + '-new Date(event.start)\n',
                start,
                timezone + '\n',
            );
            console.log(
                'end \n',
                new Date(event.end) + '-new Date(event.end)\n',
                end,
                timezone + '\n',
                '-------------------',
            );
            setElement({
                start: start,
                end: end,
                height: height,
                text: event.summary,
            });
        }
    }, [timezone, event]);

    return (
        <>
            <Head>
                <title>SSR styled-components with Next.js</title>
            </Head>
            <GlobalStyle />
            <Container>
                <ButtonsBlock>
                    <RadioGroup
                        name="timezones"
                        labels={timezones}
                        onChange={(value) => setTimezone(timezones[value])}
                    />
                    <RadioGroup
                        name="events"
                        labels={events.map(
                            (item: string, i: number) =>
                                'EventSummary' + (i + 1),
                        )}
                        onChange={(value) => setEvent(events[value])}
                    />
                </ButtonsBlock>
                <SvgBlock>
                    <SvgElement {...element} />
                </SvgBlock>
            </Container>
        </>
    );
}

export async function getServerSideProps() {
    let timezones, events;
    try {
        const resTimezones = await fetch(
            'https://raw.githubusercontent.com/truepatch/example_next.js_SSR_styled-components/main/data/timezones.json',
        );
        timezones = await resTimezones.json();
    } catch (error) {
        console.error(error);
    }
    try {
        const resEvents = await fetch(
            'https://raw.githubusercontent.com/truepatch/example_next.js_SSR_styled-components/main/data/events.json',
        );
        events = await resEvents.json();
    } catch (error) {
        console.error(error);
    }

    return {
        props: {
            timezones: timezones['timezones'],
            events: events['events'],
        },
    };
}
