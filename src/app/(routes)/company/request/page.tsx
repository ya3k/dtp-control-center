import CompanyRequestForm from '@/components/admin/company/company-request/company-request-form'
import React from 'react'

function CompanyRequest() {
  return (
    <div className='mb-8 w-full h-full'>      
      <div className=''>
      Đăng ký trở thành thành viên
        <CompanyRequestForm />
      </div>
    </div>
  )
}

export default CompanyRequest