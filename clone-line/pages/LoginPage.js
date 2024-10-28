import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import AuthContext from '../context/authContext';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../apollo/usersOperation';
import * as SecureStore from 'expo-secure-store'

export default function LoginPage({ navigation }) {
    const authContext = useContext(AuthContext);
    // console.log(authContext, "<< login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [login, { loading }] = useMutation(LOGIN);

    const handleLogin = async() => {
        try {
            const {data} = await login({
                variables: {
                    username,
                    password
                }
            })
            // console.log(data.login.access_token);
            await SecureStore.setItemAsync("access_token", data.login.access_token)
            await SecureStore.setItemAsync("userId", data.login.user._id);
            authContext.setIsLoggedIn(true)
            console.log(JSON.stringify(data.login, null, 2));
        } catch (err) {
            console.log(err);
            Alert.alert("Error", err.message)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clone-Line Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                textContentType='username'
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                textContentType='password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            <Button
              disabled={loading}
              title={loading ? 'Login...' : 'Login'}
              color='#28a745'
              onPress={async () => handleLogin()}
              />

            <View style={styles.registerLink}>
                <Text>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText} >Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#28a745',
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    linkText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
});