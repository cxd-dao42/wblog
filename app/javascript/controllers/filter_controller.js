import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "results"]
  
  // Controller variables
  currentRequest = null
  
  connect() {
    // Initialize controller
    console.log("Filter controller connected")
  }
  
  disconnect() {
    // Clean up any pending requests
    if (this.currentRequest) {
      this.currentRequest.abort()
      this.currentRequest = null
    }
  }

  fetchFilteredResults() {
    // Abort any existing request
    if (this.currentRequest) {
      this.currentRequest.abort()
    }
    
    // Get form data
    const form = this.formTarget
    const formData = new FormData(form)
    
    // Create URL with parameters
    const params = new URLSearchParams(formData)
    const url = `${form.action}?${params.toString()}`
    
    // Update URL in browser without reloading the page
    window.history.pushState({}, '', url)
    
    // Set loading state
    this.resultsTarget.classList.add("loading")
    
    // Make the request
    this.currentRequest = $.ajax({
      url: url,
      type: "GET",
      dataType: "html",
      success: (response) => {
        this.resultsTarget.innerHTML = response
        this.resultsTarget.classList.remove("loading")
        this.currentRequest = null
      },
      error: (xhr, status, error) => {
        if (status !== "abort") {
          console.error("Error fetching filtered results:", error)
          this.resultsTarget.classList.remove("loading")
          this.currentRequest = null
        }
      }
    })
  }
}