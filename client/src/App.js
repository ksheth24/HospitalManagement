import React from 'react'
import { RoomWiseView } from './views/RoomWiseView'
import { SymptomsOverviewView } from './views/SymptomsOverviewView'
import { MedicalStaffView } from './views/MedicalStaffView'
import { DepartmentView } from './views/DepartmentView'
import { AddPatient } from './sps/AddPatient'
import { OutstandingChargesView } from './views/OutstandingChargesView'
import { Home } from './Home'
import { HashRouter, Routes, Route } from 'react-router-dom';
import { RecordSymptom } from './sps/RecordSymptom'
import { BookAppointment } from './sps/BookAppointment'
import { PlaceOrder } from './sps/place_order'
import { AddStaffToDept } from './sps/AddStaffToDept'
import { AddFunds } from './sps/AddFunds'
import { AssignNurseToRoom } from './sps/AssignNurseToRoom'
import { AssignRoomToPatient } from './sps/AssignRoomToPatient'
import { AssignDoctorToAppt } from './sps/AssignDoctorToAppt'
import { ManageDepartment } from './sps/ManageDepartment';
import { ReleaseRoom } from './sps/ReleaseRoom'
import { RemovePatient } from './sps/RemovePatient';
import { RemoveStaffFromDept } from './sps/RemoveStaffFromDept.js';
import { CompleteAppt } from './sps/CompleteAppt.js';
import { CompleteOrder } from './sps/CompleteOrder';

function App() {


  return (
    <>
      <HashRouter>
        <Routes> 
          <Route path = "/" element={<Home/>} />
          <Route path = "/room_wise_view" element={<RoomWiseView/>} />
          <Route path = "/symptoms_overview_view" element={<SymptomsOverviewView/>} />
          <Route path = "/medical_staff_view" element={<MedicalStaffView/>} />
          <Route path = "/department_view" element={<DepartmentView/>} />
          <Route path = "/outstanding_charges_view" element={<OutstandingChargesView/>} />
          <Route path = "/add_patient" element={<AddPatient/>} />
          <Route path = "/record_symptom" element={<RecordSymptom/>} />
          <Route path = "/book_appointment" element={<BookAppointment/>} />
          <Route path = "/place_order" element={<PlaceOrder/>} />
          <Route path = "/add_staff_to_dept" element={<AddStaffToDept/>} />
          <Route path = "/add_funds" element={<AddFunds/>} />
          <Route path = "/assign_nurse_to_room" element={<AssignNurseToRoom/>} />
          <Route path = "/assign_room_to_patient" element={<AssignRoomToPatient/>} />
          <Route path = "/assign_doctor_to_appt" element={<AssignDoctorToAppt/>} />
          <Route path = "/manage_department" element={<ManageDepartment/>} />
          <Route path = "/release_room" element={<ReleaseRoom/>} />
          <Route path = "/remove_patient" element={<RemovePatient/>} />
          <Route path = "/remove_staff_from_dept" element={<RemoveStaffFromDept/>} />
          <Route path = "/complete_appt" element={<CompleteAppt/>} />
          <Route path = "/complete_order" element={<CompleteOrder/>} />
        </Routes>

      </HashRouter>
    </>
  )
}

export default App