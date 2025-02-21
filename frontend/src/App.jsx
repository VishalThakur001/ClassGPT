import React from "react"
import { Route, Routes } from "react-router-dom"
import {
  StartPage,
  ErrorPage,
  LoginPage,
  SignupPage,
  Home,
  ForgetPasswordPage,
  LogoutPage,
  ResetPassword,
  ChangePassword
} from "./pages/index"
import { AuthLayout } from "./components/index"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/login" element={
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        } />
        <Route path="/signup" element={
          <AuthLayout authentication={false}>
            <SignupPage />
          </AuthLayout>
        } />
        <Route path="/home" element={
          <AuthLayout> 
            <Home />
          </AuthLayout>
        } />
        <Route path="/forgot-password" element={
          <AuthLayout authentication={false}>
            <ForgetPasswordPage />
          </AuthLayout>
        }/>
        <Route path="/logout" element={
         <AuthLayout authentication={true}>
            <LogoutPage />
          </AuthLayout>
        } />
        <Route path="/reset-password" element={
          <AuthLayout authentication={false}>
            <ResetPassword />
          </AuthLayout> 
        } />
        <Route path="/change-password" element={
          <AuthLayout authentication={true}>
            <ChangePassword />
          </AuthLayout>
        } />
      </Routes>
    </div>
  )
}

export default App
