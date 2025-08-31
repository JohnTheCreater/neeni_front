import React from "react"
const CustomerTable = ({suggestion,handleCustomerClick})=>{

    return(
        
              <table className="w-[100%] bg-white border-1 shadow-xl   rounded-[1rem] ">
                <thead className="sticky top-0 bg-white border-1 z-4">
                  <tr className="border border-2 text-neutral sticky top-0">
                    <th  className="p-3 ">Customer Id</th>

                    <th className="p-3">Name</th>
                    <th  className="p-3">Address</th>
                    <th  className="p-3">Ph</th>
                    <th  className="p-3">Email</th>
                    <th  className="p-3">Total Purchase</th>
                    <th  className="p-3">Pending Payment</th>
                  </tr>
                </thead>
                <tbody className="  ">
                  {suggestion.map((customer, index) => (
                    <React.Fragment key={customer.id}>
                      <tr className="border border-2 border-gray-100 text-[1rem]" onClick={() => handleCustomerClick(customer, index)}>
                        <td className="text-center p-2">{customer.id}</td>
                        <td className="text-center p-2  max-w-[100px]  min-w-[100px]">{customer.name}</td>
                        <td className="text-center p-2">{customer.address.length > 10 ? customer.address.substring(0,10) + "..." : customer.address}</td>
                        <td className="text-center p-2">{customer.mobileno}</td>
                        <td className="text-center p-2 max-w-[150px]  min-w-[150px]">{customer.email}</td>
                        <td className="text-center p-2">{customer.bill_amount}</td>
                        <td className="text-center p-2">{customer.unpaid}</td>
                      </tr>

                    </React.Fragment>
                  ))}
                </tbody>
              </table>
    )
}
export default CustomerTable;