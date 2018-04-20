export const fetchJSON = async (...fetchArgs: Array<any>): Promise<any> => {
  const response = await fetch(...fetchArgs);

  console.log(response);

  let responseJson;
  try {
    responseJson = await response.json();
  } catch (error) {
    responseJson = null;
  }

  if (!response.ok) {
    throw new Error(responseJson ? parseError(responseJson) : 'Whoops! Error!');
  }

  return responseJson;
};
