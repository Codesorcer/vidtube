export default function RegisterForm(){
    return (
        <div>
            <form>
                <label htmlFor="fullName">Full Name: </label><br />
                <input type="text" name="fullName" id="fullName" /><br />
                <label htmlFor="email">Email: </label><br />
                <input type="email" name="email" id="email" /><br />
                <label htmlFor="username">Username: </label><br />
                <input type="text" name="username" id="username" /><br />
                <label htmlFor="password">Password: </label><br />
                <input type="password" name="password" id="password" /><br />
                <input type="submit" value="Register"/>
            </form>
        </div>
    )

}