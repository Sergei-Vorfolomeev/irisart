export const templateForPasswordRecovery = (code: string) => {
  return `<h1>Восстановление пароля</h1>
       <p>Для завершения восстановления пароля, пожалуйста, перейдите по ссылке ниже:
          <a href="https://localhost:4040/new-password?recoveryCode=${code}">восстановить пароль</a>
      </p>`
}
