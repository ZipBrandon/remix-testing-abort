import React, { Suspense, useEffect } from "react";
import { Await, Link, Outlet, useFetcher } from "@remix-run/react";

// import { loader as Loader } from "./loader";
// export const loader = Loader;
// export {action} from './action';
import type { LoaderFunctionArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { useLoaderData } from 'react-router';

export type LoaderType = typeof loader;
function fetchA(signal: AbortSignal) {
    signal.addEventListener('abort', () => console.log('Fetcher A cancelled'));

    return Promise.resolve('a');
}

function fetchB(signal: AbortSignal) {
    signal.addEventListener('abort', () => console.log('Fetcher B cancelled'));

    return new Promise(() => {});
}

async function Wait(ms: number, signal: AbortSignal) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject('aborted');
    });
  });
}

type Loader  = typeof loader
export const loader = async (args: LoaderFunctionArgs) => {
  const { request, context, params } = args;


  const signal = request.signal
  signal.addEventListener('abort', () => {
    console.log('Loader cancelled')
    });
  console.log(signal)
  async function asyncLoad() {
    await Wait(3000, signal)

    return 'ok'

  }


  return defer({
    data:  asyncLoad(),
    // or defered
    // data: asyncLoad
  });
};


export const TestingRoute: any = () => {

  const {data } = useLoaderData<Loader>()




  return <div>
    <Link to="/">Home</Link>
    <Suspense fallback={<div>loading...</div>}>
    <Await resolve={data}>
      {(_data) => {
        return <div>{_data}</div>;
      }}
    </Await>
    </Suspense>

  <Outlet/>
  </div>;
};

export default TestingRoute;

