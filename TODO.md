# Normal User Interface Implementation

## Tasks
- [x] Backend: Add getUserRatings method in stores.service.ts
- [x] Backend: Add GET /stores/ratings/my endpoint in stores.controller.ts
- [x] Frontend: Add getMyRatings method in store.service.ts
- [x] Frontend: Create RatingModal component
- [x] Frontend: Update StoreCard to use RatingModal, remove email display
- [x] Frontend: Update UserDashboard to fetch real ratings, add search bar, add sorting

# Remaining User Role Functionalities

## Tasks
- [ ] User Profile Page: View own profile information
- [ ] Edit Profile: Allow users to update name, email, address
- [ ] Change Password: Functionality to change user password
- [ ] Ratings History: View history of user's ratings
- [ ] Backend: Add users module/controller/service for profile management

# Admin Role Implementation

## Tasks
- [x] Backend: Create users module (controller, service, module, DTOs)
- [x] Backend: Create admin module (controller, service, module) for dashboard stats
- [x] Backend: Update stores.controller.ts with admin routes (GET/POST /admin/stores)
- [x] Backend: Update app.module.ts to import users and admin modules
- [x] Frontend: Update user.service.ts with admin methods
- [x] Frontend: Update store.service.ts with admin methods
- [x] Frontend: Create admin.service.ts for dashboard stats
- [x] Frontend: Update UserList.tsx for filters and sortable columns
- [x] Frontend: Create AdminStoreList.tsx (table format with filters/sorting)
- [x] Frontend: Create CreateUserForm.tsx component
- [x] Frontend: Create CreateStoreForm.tsx component
- [x] Frontend: Update AdminDashboard.tsx with stats cards, filters, create forms
- [x] Test admin login and dashboard access
- [x] Verify CRUD operations and filters
