export const notFoundPage =
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Error</title></head><body><pre>Cannot ${method} ${pathname}</pre></body></html>';

export const fillStringTemplate = (
  template: string,
  data: { [key: string]: string }
) => {
  return template.replace(/\${(.*?)}/g, (match, key) => data[key.trim()]);
};

export const parseUrlParameters = (searchParams: URLSearchParams) => {
  const uniqueParamKeys = [...new Set(searchParams.keys())];

  return uniqueParamKeys.reduce(
    (urlParams: { [key: string]: any }, currentParamKey) => {
      urlParams[currentParamKey] = searchParams.getAll(currentParamKey);

      if (urlParams[currentParamKey].length === 1)
        urlParams[currentParamKey] = urlParams[currentParamKey][0];

      return urlParams;
    },
    {}
  );
};
