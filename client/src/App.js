import React from 'react'
import { RoomWiseView } from './views/RoomWiseView'
import { SymptomsOverviewView } from './views/SymptomsOverviewView'
import { MedicalStaffView } from './views/MedicalStaffView'
import { DepartmentView } from './views/DepartmentView'
import { AddPatient } from './sps/AddPatient'
import { OutstandingChargesView } from './views/OutstandingChargesView'
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {


  return (
    <>
      <HashRouter>
        <Routes> 
          <Route path = "/room_wise_view" element={<RoomWiseView/>} />
          <Route path = "/symptoms_overview_view" element={<SymptomsOverviewView/>} />
          <Route path = "/medical_staff_view" element={<MedicalStaffView/>} />
          <Route path = "/department_view" element={<DepartmentView/>} />
          <Route path = "/outstanding_charges_view" element={<OutstandingChargesView/>} />
          <Route path = "/add_patient" element={<AddPatient/>} />
        </Routes>

      </HashRouter>
    </>
  )
}

export default App