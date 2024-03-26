const fetchnc = async (
  url: string,
  ttl = 0,
  options?: RequestInit,
  identifier: string = ""
) => {
  let lc = window.localStorage.getItem(`${url}-${identifier}`);
  let r =
    lc != null
      ? JSON.parse(lc)
      : {
          res: [],
          last: null,
        };
  let e = (new Date().getTime() - r.last) / 1000;
  if (e <= ttl) {
    console.info(
      `serving cached response, fetching again in ${ttl - e} seconds`
    );
    return r.res;
  }
  const f = await fetch(url, options);
  r.res = f;
  r.last = new Date().getTime();
  window.localStorage.setItem(`${url}-${identifier}`, JSON.stringify(r));
  return r.res;
};

export default fetchnc;
