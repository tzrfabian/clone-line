import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { getItemAsync } from "expo-secure-store";

const httpLink = createHttpLink({
    uri: 'http://fabian_server.okattako.site/',
});

const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await getItemAsync("access_token")
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

export default apolloClient