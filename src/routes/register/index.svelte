<script lang="ts">
    import { InfoBar, TextBox, TextBlock, Button } from "fluent-svelte";
    import { emailValidationRegex, passwordValidationRegex } from "$lib/auth";

    let showError = false;
    let errorMessage = "";

    let email: String;
    let password: String;
    let confirmedPassword: String;
    $: isPasswordInvalid = !passwordValidationRegex.test(password);

    function onRegister() {
        if (!emailValidationRegex.test(email)) {
            showError = true;
            errorMessage = "Invalid e-mail address.";
        } else if (password != confirmedPassword) {
            showError = true;
            errorMessage = "Passwords don't match.";
        } else {
            showError = false;
        }

        if (!isPasswordInvalid) {
            fetch("/api/register", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            // todo handle response
        }
    }
</script>

<div>
    <TextBlock variant="title">Register</TextBlock>
    <InfoBar bind:open={showError} bind:message={errorMessage} severity="critical" class="full-width"/>
    <TextBox bind:value={email} type="email" placeholder="E-mail"></TextBox>
    <TextBox bind:value={password} type="password" placeholder="Password"></TextBox>
    <TextBox bind:value={confirmedPassword} type="password" placeholder="Confirm password"></TextBox>
    <InfoBar bind:open={isPasswordInvalid} message="A password must consist of at least eight characters, including an uppercase letter, a digit and a special character." severity="caution" class="full-width" closable={false}/>
    <Button variant="accent" on:click={onRegister}>Register</Button>
    <hr>
    <TextBlock>Already have an account? <a href="/login">Log in</a></TextBlock>
</div>

<style lang="scss">
    @use "register";
</style>