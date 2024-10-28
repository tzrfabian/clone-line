import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { REGISTER } from '../apollo/usersOperation';

export default function RegisterPage({ navigation }) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, {loading}] = useMutation(REGISTER);

    const handleRegister = async () => {
        try {
            const {data} = await register({
                variables: {
                    username,
                    name,
                    email,
                    password
                }
            });
            console.log(data);
            Alert.alert("Success", "Login Success");
            navigation.navigate('Login');
        } catch (err) {
            console.log(err);
            Alert.alert("Error", err.message)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clone-Line Register</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                textContentType='username'
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Name"
                textContentType='name'
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail}
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
              title={loading ? 'Register...' : 'Register'}
              color='#28a745'
              onPress={async() => handleRegister()}
            />

            <View style={styles.loginLink}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>Login</Text>
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
    loginLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    linkText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
});