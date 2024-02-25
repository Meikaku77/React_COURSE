import App from "../App";
import {render, fireEvent} from '@testing-library/react'


describe("Login", ()=>{
    it("Should render title screen", ()=>{
        const sut = render(<App />)

        const title= sut.getByText("TDD REACT")

        expect(title).toBeInTheDocument()
    })
})