export const templateForRegistration = (code: string | null) => {
  return `<h1>Благодарим за регистрацию!</h1>
 <p>Для завершения процесса регистрации перейдите по ссылке ниже:
     <a href="https://somesite.com/confirm-email?code=${code}">завершить регистрацию</a>
 </p>`
}
