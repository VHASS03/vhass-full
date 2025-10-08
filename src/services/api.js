const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const CACHE_BUSTER = Date.now() + Math.random(); // Force cache invalidation

// Debug logging
console.log('🔍 API Configuration:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🚀 ApiService initialized with baseURL:', this.baseURL);
  }

  // Always include auth token and allow extra headers
  getHeaders(extraHeaders = {}) {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    };
  }

  // Helper method to make API calls
  async makeRequest(endpoint, options = {}) {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    // Ensure baseURL doesn't end with slash to avoid double slashes
    const baseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const url = `${baseURL}/${cleanEndpoint}?_cb=${CACHE_BUSTER}`;
    console.log('🌐 Making API request to:', url);
    
    // Create AbortController for request cancellation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const config = {
      headers: this.getHeaders(options.headers),
      credentials: 'include', // Include cookies for session management
      mode: 'cors', // Explicitly set CORS mode
      signal: controller.signal, // Add abort signal
      ...options,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId); // Clear timeout on successful response
      
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        // Clear any stored auth data
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        // Don't automatically redirect - let the AuthContext handle it
        throw new Error('Unauthorized');
      }
      
      // Check if response is JSON before trying to parse
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'API request failed');
        }
        
        return data;
      } else {
        // Handle non-JSON responses (like HTML error pages)
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout on error
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        console.error('API request was aborted or timed out');
        throw new Error('Request timeout - please try again');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network error:', error);
        throw new Error('Network error - please check your connection');
      }
      
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication APIs
  async register(userData) {
    return this.makeRequest('/api/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    console.log('🔐 Attempting login with credentials:', { email: credentials.email });
    const response = await this.makeRequest('/api/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    console.log('🔐 Login response:', response);
    return response;
  }

  async googleLogin(googleData) {
    return this.makeRequest('/api/user/google-login', {
      method: 'POST',
      body: JSON.stringify(googleData),
    });
  }

  async logout() {
    return this.makeRequest('/api/user/logout', {
      method: 'POST',
    });
  }

  async verifyUser(token) {
    return this.makeRequest('/api/user/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async forgotPassword(email) {
    return this.makeRequest('/api/user/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, newPassword) {
    return this.makeRequest('/api/user/reset', {
      method: 'POST',
      body: JSON.stringify({ token, password: newPassword }),
    });
  }

  async getProfile() {
    console.log('👤 Fetching user profile...');
    const response = await this.makeRequest('/api/user/me');
    console.log('👤 Profile response:', response);
    return response;
  }

  async updateProfile(profileData) {
    return this.makeRequest('/api/user/update', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Course APIs
  async getAllCourses() {
    return this.makeRequest('/api/course/all');
  }

  async getCourse(courseId) {
    return this.makeRequest(`/api/course/${courseId}`);
  }

  async getMyCourses() {
    return this.makeRequest('/api/mycourse');
  }

  async getUserCourses() {
    return this.makeRequest('/api/user/courses');
  }

  async getLectures(courseId) {
    return this.makeRequest(`/api/lectures/${courseId}`);
  }

  async getLecture(lectureId) {
    return this.makeRequest(`/api/lecture/${lectureId}`);
  }

  async addProgress(progressData) {
    return this.makeRequest('/api/user/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  async getProgress() {
    return this.makeRequest('/api/user/progress');
  }

  // Workshop APIs
  async getAllWorkshops() {
    return this.makeRequest('/api/workshop/all');
  }

  async getWorkshop(workshopId) {
    return this.makeRequest(`/api/workshop/${workshopId}`);
  }

  async getMyWorkshops() {
    return this.makeRequest('/api/myworkshop');
  }

  async getUserWorkshops() {
    return this.makeRequest('/api/user/workshops');
  }

  async getEnrollmentHistory() {
    return this.makeRequest('/api/user/enrollments');
  }

  // Contact
  async sendContactMessage(payload) {
    return this.makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Payment APIs
  async phonepeCheckout(type, id) {
    const endpoint = type === 'course' ? `/api/course/${id}/phonepe-checkout` : `/api/workshop/phonepe/checkout/${id}`;
    return this.makeRequest(endpoint, {
      method: 'POST',
    });
  }

  async phonepeStatus(type, transactionId) {
    const endpoint = type === 'course' ? `/api/course/phonepe/status/${transactionId}` : `/api/workshop/phonepe/status/${transactionId}`;
    return this.makeRequest(endpoint, {
      method: 'POST',
    });
  }

  // Google OAuth
  getGoogleAuthUrl() {
    // Use API base and append /auth/google so it hits /api/auth/google
    return `${API_BASE_URL}/api/auth/google`;
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }

  // Admin APIs
  async getAdminStats() {
    return this.makeRequest('/admin/stats');
  }

  async getAllUsers() {
    return this.makeRequest('/admin/users');
  }

  // Admin: list all courses
  async adminGetAllCourses() {
    return this.makeRequest('/admin/courses');
  }

  // Admin: list all workshops
  async adminGetAllWorkshops() {
    return this.makeRequest('/admin/workshops');
  }

  async createCourse(courseData) {
    return this.makeRequest('/admin/course', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(courseId, courseData) {
    return this.makeRequest(`/admin/course/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(courseId) {
    return this.makeRequest(`/admin/course/${courseId}`, {
      method: 'DELETE',
    });
  }

  async createWorkshop(workshopData) {
    return this.makeRequest('/admin/workshop', {
      method: 'POST',
      body: JSON.stringify(workshopData),
    });
  }

  async updateWorkshop(workshopId, workshopData) {
    return this.makeRequest(`/admin/workshop/${workshopId}`, {
      method: 'PUT',
      body: JSON.stringify(workshopData),
    });
  }

  async deleteWorkshop(workshopId) {
    return this.makeRequest(`/admin/workshop/${workshopId}`, {
      method: 'DELETE',
    });
  }

  async updateUserRole(userId, role) {
    return this.makeRequest(`/admin/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ id: userId, role }),
    });
  }

  async deleteUser(userId) {
    return this.makeRequest(`/admin/user/${userId}`, {
      method: 'DELETE',
    });
  }

  async getUserDetails(userId) {
    return this.makeRequest(`/admin/user/${userId}`);
  }

  // Payment utilities
  async fixEnrollment() {
    return this.makeRequest('/api/payment/fix-enrollment', {
      method: 'POST'
    });
  }

  async getUserTransactions(userId) {
    return this.makeRequest(`/api/payment/user-transactions/${userId}`);
  }

  // Admin enrollment management
  async getAllEnrollments() {
    return this.makeRequest('/api/admin/enrollments');
  }

  async getCourseEnrollments(courseId) {
    return this.makeRequest(`/api/admin/course/${courseId}/enrollments`);
  }
}

export default new ApiService();
