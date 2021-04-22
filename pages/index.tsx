import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";

import values from "../scripts/values.json";
import dates from "../scripts/dates.json";
import names from "../scripts/names.json";

import styles from "../styles/Home.module.scss";

export default function Home({ values, dates, names }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTarget, setCurrentTarget] = useState();

  const time = useMemo(() => {
    return `${dates[currentIndex].hour.toString().padStart(2, "0")}:${dates[
      currentIndex
    ].minute
      .toString()
      .padStart(2, "0")} – ${dates[currentIndex].date}/${
      dates[currentIndex].month + 1
    }`;
  }, [dates, currentIndex]);

  useEffect(() => {
    let int = setInterval(() => {
      setCurrentIndex((s) => (s + 1) % values[0].values.length);
    }, 500);

    return () => {
      clearInterval(int);
    };
  }, []);

  const onMouseEnter = useCallback((e) => {
    setCurrentTarget(e.target.dataset.name);
  }, []);

  const onMouseLeave = useCallback((e) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCurrentTarget((t) => (e.target.dataset.name === t ? undefined : t));
      });
    });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>London Migratory Patterns</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          defer
          data-domain="migratory.jthaw.club"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </Head>

      <main className={styles.main}>
        <div className={styles.key}>
          <div className={styles.track} />
          <div className={styles.label}>
            <span>Empty dock</span>
            <span>Full dock</span>
          </div>
        </div>
        <div className={styles.display}>{time}</div>
        <div className={styles.target}>{currentTarget}</div>
        <div className={styles.figure}>
          {values.map((v) => {
            // const color = getClosestColor(v.values[currentIndex], colors);
            // if (!color) {
            //   return null;
            // }

            return (
              <span
                key={v.id}
                className={styles.base}
                style={
                  {
                    "--x-pos": Math.round(v.x * 100) / 100,
                    "--y-pos": Math.round((1 - v.y) * 50) / 50,
                    "--z": Math.round(v.y * 1000),
                  } as React.CSSProperties
                }
              >
                <span
                  className={styles.tower}
                  style={
                    {
                      "--height": v.values[currentIndex],
                      "--hue": 240 - v.values[currentIndex] * 240,
                      // "--top-color": `rgb(${color.r}, ${color.g}, ${color.b})`,
                    } as React.CSSProperties
                  }
                  data-name={names[v.id]}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                />
              </span>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      values,
      dates,
      names,
    }, // will be passed to the page component as props
  };
}
