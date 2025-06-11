# Arabic Language Support Implementation

## Overview
The VoucherSystem frontend now supports both English and Arabic languages with proper RTL (Right-to-Left) layout support. The language is automatically detected from URL parameters sent by the Android app.

## URL Parameters for Language Support

### English (Default)
```
http://domain/?user_id=12345&lang=en
http://domain/?user_id=12345
```

### Arabic
```
http://domain/?user_id=12345&lang=ar
```

## Implementation Details

### 1. Language Parameter Handling
- **File**: `web/src/application/utils/getUserId.ts`
- **Function**: `getAppParams()`
- Extracts language from URL parameters (`lang` or from hash)
- Defaults to English (`en`) if no language specified
- Supports both URL search params and hash params for WebView compatibility

### 2. App-Level Language Initialization
- **File**: `web/src/app/App.tsx`
- Initializes i18next with the correct language from URL parameters
- Sets document direction (`dir="rtl"` for Arabic, `dir="ltr"` for English)
- Sets document language attribute for accessibility
- Uses React hooks to automatically update when language changes

### 3. Translation Files

#### English Translations
- **File**: `web/public/locales/en/common.json`
- Contains all English text for the voucher system
- Includes general UI text and voucher-specific terminology

#### Arabic Translations
- **File**: `web/public/locales/ar/common.json`
- Complete Arabic translations for all UI elements
- Proper Arabic terminology for voucher-related concepts

### 4. Component Internationalization

All components now use React i18next hooks instead of hardcoded text:

#### VoucherListPage
- `t('vouchers.myVouchers')` - "My Vouchers" / "قسائمي"
- `t('vouchers.loadingVouchers')` - Loading state
- `t('vouchers.vouchersAvailable', { count })` - Voucher count with pluralization

#### VoucherCard
- `t('vouchers.active')` - "Active" / "نشطة"
- `t('vouchers.used')` - "Used" / "مستخدمة"

#### VoucherDetailsModal
- `t('vouchers.voucherDetails')` - Modal title
- `t('vouchers.price')` - "Price" / "السعر"
- `t('vouchers.purchased')` - "Purchased" / "تاريخ الشراء"
- `t('vouchers.redemptionCode')` - QR code section title
- `t('vouchers.showQRCode')` - QR code instructions

#### EmptyState
- `t('vouchers.noVouchersYet')` - Empty state title
- `t('vouchers.noVouchersDescription')` - Empty state description
- `t('vouchers.browseVouchers')` - Call-to-action button

#### QRCodeView
- `t('vouchers.noQRCodeAvailable')` - No QR code message
- `t('vouchers.qrWarning')` - Security warning

### 5. RTL (Right-to-Left) Support

#### CSS Files
- **File**: `web/src/application/i18n/rtl-styles.css`
- Targeted RTL styling for Arabic layout without breaking existing design
- Specific CSS classes for voucher components
- Handles text direction, layout positioning, and visual hierarchy

#### Key RTL Features
- **Text alignment**: Right-aligned for Arabic, left-aligned for English
- **Layout direction**: Specific flex direction reversals for voucher components
- **Icon positioning**: Icons positioned correctly for RTL flow
- **Price and date formatting**: Maintains LTR for numbers while supporting RTL layout
- **Component-specific classes**: Targeted styling without global overwrites

#### RTL-Specific CSS Classes
- `.header-with-icon` - Header layout with proper icon/text positioning
- `.voucher-title-status` - Voucher card title and status badge layout
- `.voucher-footer-content` - Price and date footer layout
- `.voucher-details-grid` - Details modal grid layout
- `.modal-header` - Modal header with back button positioning
- `.qr-warning` - QR code warning message layout
- `.ltr-content` - Preserves LTR for prices, dates, and numbers

### 6. Font Support
- **File**: `web/src/presentation/styles/global.css`
- Uses SakrPro font family for both languages
- Proper font weights and line heights for Arabic text
- Consistent typography across both languages

## Android Integration

### WebView URL Format
Your Android app should construct URLs with the language parameter:

```kotlin
// For English
val url = "http://your-domain/?user_id=$userId&lang=en"

// For Arabic  
val url = "http://your-domain/?user_id=$userId&lang=ar"

// Auto-detect from system locale
val locale = Locale.getDefault().language
val lang = if (locale == "ar") "ar" else "en"
val url = "http://your-domain/?user_id=$userId&lang=$lang"
```

### Supported Parameters
- `user_id` (required): User identifier
- `lang` (optional): Language code (`en` or `ar`)
- `token` (optional): Authentication token
- `theme` (optional): UI theme preference
- `return_url` (optional): Return URL for navigation

## Testing

### English Version
```bash
curl "http://localhost/?user_id=12345&lang=en"
```

### Arabic Version
```bash
curl "http://localhost/?user_id=12345&lang=ar"
```

### Browser Testing
1. Open: `http://localhost/?user_id=12345&lang=en`
2. Open: `http://localhost/?user_id=12345&lang=ar`
3. Verify:
   - Text appears in correct language
   - Layout flows correctly (LTR for English, RTL for Arabic)
   - Icons and buttons are positioned properly
   - Font rendering is clear and readable
   - Header icon appears on the correct side for each language
   - Voucher cards show proper layout direction
   - Price and date maintain readability while respecting layout direction

## RTL Layout Improvements

### Specific Layout Fixes Applied:

1. **Header Layout**
   - Icon and text positioning reversed for Arabic
   - Proper spacing maintained in both directions

2. **Voucher Cards**
   - Title and status badge positioning corrected
   - Price and date layout adjusted for RTL
   - Clock icon positioned appropriately

3. **Modal Components**
   - Back button and title positioning
   - Grid layouts with proper text alignment
   - QR warning message layout

4. **Content Preservation**
   - Prices and dates maintain LTR formatting for readability
   - Numbers display correctly regardless of interface language

## Translation Keys Reference

### Authentication
- `auth.authRequired` - "Authentication Required" / "مطلوب تسجيل الدخول"
- `auth.accessThroughApp` - "Please access this page through the 4Sale mobile app." / "يرجى الوصول لهذه الصفحة من خلال تطبيق فور سيل للجوال."

### Vouchers
- `vouchers.myVouchers` - "My Vouchers" / "قسائمي"
- `vouchers.active` - "Active" / "نشطة"
- `vouchers.used` - "Used" / "مستخدمة"
- `vouchers.redeemed` - "Redeemed" / "مُستخدمة"
- `vouchers.price` - "Price" / "السعر"
- `vouchers.purchased` - "Purchased" / "تاريخ الشراء"
- `vouchers.loadingVouchers` - "Loading vouchers..." / "جاري تحميل القسائم..."
- `vouchers.vouchersAvailable` - Pluralized voucher count
- `vouchers.errorLoadingVouchers` - "Error loading vouchers" / "خطأ في تحميل القسائم"
- `vouchers.tryAgain` - "Try Again" / "حاول مرة أخرى"
- `vouchers.voucherDetails` - "Voucher Details" / "تفاصيل القسيمة"
- `vouchers.redemptionCode` - "Redemption Code" / "رمز الاستخدام"
- `vouchers.showQRCode` - "Show this QR code to redeem your voucher" / "اعرض هذا الرمز لاستخدام القسيمة"
- `vouchers.voucherRedeemed` - "Voucher Redeemed" / "تم استخدام القسيمة"
- `vouchers.noVouchersYet` - "No Vouchers Yet" / "لا توجد قسائم بعد"
- `vouchers.browseVouchers` - "Browse Vouchers" / "تصفح القسائم"
- `vouchers.qrWarning` - "Do not share this QR code. It can only be used once." / "لا تشارك هذا الرمز. يمكن استخدامه مرة واحدة فقط."

## Technical Architecture

### Language Detection Flow
1. URL parsed for `lang` parameter
2. Language validated against supported languages (`en`, `ar`)
3. i18next language changed programmatically
4. Document direction and language attributes updated
5. Components re-render with new translations

### RTL Implementation Strategy
- **Targeted approach**: Specific CSS classes for components rather than global overrides
- **Content preservation**: LTR maintained for numbers, prices, and dates
- **Visual hierarchy**: Proper icon and content positioning for both languages
- **Responsive design**: Layout works correctly at all screen sizes
- **Performance**: Minimal CSS overhead with focused selectors

## Benefits

1. **Seamless User Experience**: Users see content in their preferred language immediately upon page load
2. **Proper RTL Support**: Arabic text flows naturally right-to-left with appropriate layout adjustments
3. **Accessibility**: Proper language attributes for screen readers and assistive technologies
4. **Maintainable**: Centralized translation files for easy content updates
5. **Scalable**: Easy to add more languages in the future
6. **Android Integration Ready**: URL-based language switching works perfectly with WebView
7. **Visual Consistency**: Layout maintains design integrity across both language directions
8. **Content Clarity**: Numbers and dates remain readable while respecting interface direction 