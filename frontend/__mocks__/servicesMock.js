// Mock pour authService
export const authService = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn()
};

// Mock pour eventService
export const eventService = {
  getAllEvents: jest.fn(),
  getEventById: jest.fn(),
  createEvent: jest.fn(),
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),
  joinEvent: jest.fn(),
  leaveEvent: jest.fn(),
  getUserEvents: jest.fn(),
  getUserParticipations: jest.fn(),
  getUpcomingEvents: jest.fn(),
  uploadEventImages: jest.fn()
};

// Mock pour newsService
export const newsService = {
  getAllNews: jest.fn(),
  getNewsById: jest.fn(),
  createNews: jest.fn(),
  updateNews: jest.fn(),
  deleteNews: jest.fn()
};

// Mock pour userService
export const userService = {
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  deleteUser: jest.fn()
};

// Mock pour commentService
export const commentService = {
  getCommentsByEventId: jest.fn(),
  addComment: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn()
};

// Mock pour ratingService
export const ratingService = {
  getEventRating: jest.fn(),
  rateEvent: jest.fn(),
  updateRating: jest.fn(),
  deleteRating: jest.fn()
};

// Mock pour categorieService
export const categorieService = {
  getAllCategories: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn()
}; 