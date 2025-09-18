# Staff Count and Patient Count Ranges Solution

## 📋 Dropdown Options Analysis

Based on the signup form dropdowns, here are the exact values:

### Staff Count Options:
- `""` (empty) → "Select staff count"
- `"1-10"` → "1-10 staff"
- `"11-25"` → "11-25 staff" 
- `"26-50"` → "26-50 staff"
- `"51-100"` → "51-100 staff"
- `"100+"` → "100+ staff"

### Patient Count Options:
- `""` (empty) → "Select patient count"
- `"1-50"` → "1-50 patients"
- `"51-100"` → "51-100 patients"
- `"101-250"` → "101-250 patients"
- `"251-500"` → "251-500 patients"
- `"500+"` → "500+ patients"

## 🔧 Database Schema

### Column Types:
```sql
staff_count VARCHAR(20) DEFAULT '0',
patient_count VARCHAR(20) DEFAULT '0',
```

### Valid Values:
```sql
-- Staff count valid values
'0', '1-10', '11-25', '26-50', '51-100', '100+'

-- Patient count valid values  
'0', '1-50', '51-100', '101-250', '251-500', '500+'
```

## 💾 Data Storage Logic

### Signup Form → Database:
```javascript
// User selects "1-10 staff" → Database stores "1-10"
// User selects "1-50 patients" → Database stores "1-50"
// User selects nothing → Database stores "0"

staff_count: sanitizeStaffCount(staffCount),
patient_count: sanitizePatientCount(patientCount),
```

### Validation Functions:
```javascript
const validStaffCounts = ['1-10', '11-25', '26-50', '51-100', '100+'];
const validPatientCounts = ['1-50', '51-100', '101-250', '251-500', '500+'];

const sanitizeStaffCount = (value: string): string => {
  if (!value || value === '') return '0';
  return validStaffCounts.includes(value) ? value : '0';
};

const sanitizePatientCount = (value: string): string => {
  if (!value || value === '') return '0';
  return validPatientCounts.includes(value) ? value : '0';
};
```

## 🔄 Migration Logic

### For Existing Integer Data:
```sql
-- Convert existing staff_count integers to ranges
staff_count_new = CASE 
  WHEN staff_count = 0 OR staff_count IS NULL THEN '0'
  WHEN staff_count BETWEEN 1 AND 10 THEN '1-10'
  WHEN staff_count BETWEEN 11 AND 25 THEN '11-25'
  WHEN staff_count BETWEEN 26 AND 50 THEN '26-50'
  WHEN staff_count BETWEEN 51 AND 100 THEN '51-100'
  WHEN staff_count > 100 THEN '100+'
  ELSE '1-10'
END

-- Convert existing patient_count integers to ranges
patient_count_new = CASE 
  WHEN patient_count = 0 OR patient_count IS NULL THEN '0'
  WHEN patient_count BETWEEN 1 AND 50 THEN '1-50'
  WHEN patient_count BETWEEN 51 AND 100 THEN '51-100'
  WHEN patient_count BETWEEN 101 AND 250 THEN '101-250'
  WHEN patient_count BETWEEN 251 AND 500 THEN '251-500'
  WHEN patient_count > 500 THEN '500+'
  ELSE '1-50'
END
```

## 📊 Example Data

### Before (Integer):
```
agency_name | staff_count | patient_count
ABC Health  | 6          | 26
XYZ Medical | 18         | 76
```

### After (String Ranges):
```
agency_name | staff_count | patient_count
ABC Health  | 1-10       | 1-50
XYZ Medical | 11-25      | 51-100
```

## 🎯 Benefits

1. **Exact Match**: Database values match dropdown selections exactly
2. **No Data Loss**: Preserves the original range information
3. **Validation**: Only accepts valid dropdown values
4. **Consistency**: Same values used in form and database
5. **Flexibility**: Easy to add new ranges in the future

## 🧪 Testing

1. **Select "1-10 staff"** → Should store `"1-10"`
2. **Select "1-50 patients"** → Should store `"1-50"`
3. **Leave empty** → Should store `"0"`
4. **Invalid value** → Should default to `"0"`

## 📁 Files Updated

- `complete_database_schema.sql` - Updated column types
- `update_count_columns_to_strings.sql` - Migration script
- `app/signup/page.tsx` - Added validation and sanitization
- `count_ranges_solution.md` - This documentation
