import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import App from "./App"
import { test, expect } from "@jest/globals"
import { screen } from "@testing-library/dom"

test("should render a list of posts", () => {
  render(<App />)

  const post = screen.getByText("qui est esse")
  expect(post).toBeInTheDocument()
})
