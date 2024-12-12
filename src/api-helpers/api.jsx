class AuthService {
    constructor(baseURL) {
      this.baseURL = baseURL;
    }
  
    // Helper method for making POST requests
    async post(endpoint, body) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Something went wrong!");
        }
  
        return await response.json();
      } catch (error) {
        console.error("API call error:", error.message);
        throw error;
      }
    }
  
    // Register API call
    async register(data) {
      return this.post("/api/auth/register", data);
    }
  
    // Login API call
    async login(data) {
      return this.post("/api/auth/login", data);
    }

    async refetch(data) {
        return this.post("/api/auth/refetch", data);
      }
  }
  
  // Create a single instance of the service
  const authService = new AuthService("http://localhost:5000");
  
  export default authService;
  