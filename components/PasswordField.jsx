'use client'

import { useState } from 'react'
import { FaRegEyeSlash,FaRegEye } from "react-icons/fa6";

export default function PasswordField({ value, onChange, required, minLength }) {
  const [show, setShow] = useState(false)

  return (
    <div className="password-field">
      <input
        required={required}
        minLength={minLength}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
      />
      <button type="button" className="password-toggle" onClick={() => setShow((s) => !s)} tabIndex={-1}>
        {show ? <FaRegEye/> : <FaRegEyeSlash />}
      </button>
    </div>
  )
}
