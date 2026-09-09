# KisanToGrahak project review

Updated 10 September 2026. Changes follow the existing standalone Angular pages, core services, component CSS, Bootstrap/PrimeNG, and Farmer controllers.

## Database scope

No new tables, columns, migrations, inventory system, or payment system were added. Existing listing quantities remain listing information; checkout does not reserve or decrement them. Orders use the current cart, orders, order items, users, and farmer products tables.

## Completed changes

- Connected product Add to Cart, farmer search/filtering, and grid/list switches.
- Fixed farmer listing update/delete URLs and refreshed joined listing data after creation.
- Merged repeated additions to the same cart listing; rejected nonpositive quantities.
- Replaced checkout sample counts, fees and totals with cart data, validated delivery details, blocked empty/loading carts and repeated submissions, and navigated successful orders to My Orders.
- Put order creation and cart clearing inside one serializable transaction, including the initial cart read, to prevent two requests from consuming the same cart.
- Connected farmer delivery updates to the existing order-item endpoint; both status-update routes now recalculate the parent order status.
- Added admin order browsing and retained the selected order after delivery updates.
- Fixed login token response handling, logout, return URLs, registration password matching and broken inline sign-up links.
- Added role guards to management pages. API checks enforce authentication, current database roles, and ownership. Farmers see only their own items in shared orders. Refresh tokens cannot authorize normal protected API actions.
- Restricted self-registration to Farmer/Customer, excluded customer accounts from the public farmer directory, and added an authenticated own-profile lookup.
- Hash new passwords in the existing password column. Existing plaintext accounts migrate on successful login; responses no longer contain passwords. Deploy UI/API together and test this migration in staging before using the new API against production.
- Removed automatic HTTP retries, so failed mutations are not submitted repeatedly. API tokens are sent only to the configured API. Expired sessions return to sign-in.
- Fixed mobile navigation, responsive cart layout, search sizing, dark-mode form contrast, disabled/focus states, placeholder branding, sample statistics, sample ratings, and dead footer links.
- Connected admin role/category create-reset and delete controls; corrected category table alignment and sample pagination counts.
- Lazy-loaded route components. Initial production bundle reduced from approximately 1.66 MB to 903 KB.

## Verification

- Angular production build: passed.
- Angular tests: 30 files / 37 tests passed, including seven shopping-flow regressions.
- .NET API: builds successfully; 33 access checks passed with no database or network interaction during the checks.
- Browser: inspected desktop storefront and 390-pixel mobile home/registration; exercised mobile navigation and product search against the existing public catalogue.
- Browser preview: http://127.0.0.1:4301. Development environment currently points at the live API. No production account, cart, listing or order was changed during browser verification.
- Existing warnings remain: 500 KB initial bundle warning, 8 KB master component CSS warning, and existing .NET nullable warnings.

Commands from the repository root:

~~~powershell
Set-Location farmerToCustomer_ui
npm.cmd run build
npm.cmd test -- --watch=false
Set-Location ..
dotnet run --project tests/FarmerApiChecks/FarmerApiChecks.csproj
~~~

## Staging release checks still required

The automated API checks exercise anonymous access denial, public read/login availability, refresh-token rejection, and filter coverage. They do not substitute for database-backed ownership or transaction tests.

Use a staging copy of the existing schema and separate customer/farmer/admin accounts to verify:

1. Existing and newly registered users can log in; plaintext passwords migrate to hashes and no password/hash is returned.
2. One customer cannot read or modify another customer's cart/orders; farmers cannot edit another farmer's listings or order items; customer tokens cannot use management APIs.
3. Add the same listing twice, update quantities, remove it, and verify header/checkout totals stay consistent.
4. Place an order with multiple farmers, verify cart clearing and price snapshots, then mark each farmer's items delivered and verify parent status transitions.
5. Submit checkout concurrently: only one request consumes that cart. Failed transactions leave the cart intact. No listing quantity should change.
6. Test forbidden registration roles, stale/expired access tokens, and refresh tokens used as access tokens.
7. Review the live sample catalogue/accounts before presentation. Do not silently delete student records.

No deployment was performed. Real support phone/WhatsApp details were not provided, so the sample phone links were removed. The existing support email/address still need owner verification. External product/profile image links and live sample data are outside the code's reliability guarantee. Online payment, refunds, notifications and stock management are not implemented features and should not be listed on student CVs.
