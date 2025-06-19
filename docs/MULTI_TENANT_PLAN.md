# CorgiGo Multi-tenant Food Delivery Platform

## 📖 Overview
แปลงระบบจาก "แสดงทุกร้านในหน้าเดียว" เป็น "แต่ละร้านมีหน้าเว็บของตัวเอง" พร้อมระบบแอดมินจัดการ

## 🎯 Goals
1. แต่ละร้านมี subdomain ของตัวเอง (restaurant.corgigo.com)
2. ลูกค้าเข้าถึงได้เฉพาะร้านนั้น ไม่เห็นร้านอื่น
3. ระบบแอดมินจัดการทุกร้าน สามารถระงับร้านได้
4. SEO และ branding ต่อร้าน

## 🏗️ System Architecture

### URL Structure
```
https://lacasa.corgigo.com      → La Casa Restaurant
https://sushizen.corgigo.com    → Sushi Zen  
https://admin.corgigo.com       → Admin Dashboard
https://corgigo.com             → Landing/Marketing Site
```

### Database Changes

#### Restaurant Table Extensions
```sql
ALTER TABLE restaurants ADD COLUMN subdomain VARCHAR(50) UNIQUE;
ALTER TABLE restaurants ADD COLUMN custom_domain VARCHAR(100) UNIQUE;
ALTER TABLE restaurants ADD COLUMN is_active BOOLEAN DEFAULT true;
ALTER TABLE restaurants ADD COLUMN is_suspended BOOLEAN DEFAULT false;
ALTER TABLE restaurants ADD COLUMN suspended_at TIMESTAMP NULL;
ALTER TABLE restaurants ADD COLUMN suspended_by VARCHAR(191) NULL;
ALTER TABLE restaurants ADD COLUMN suspend_reason TEXT NULL;
ALTER TABLE restaurants ADD COLUMN theme_primary_color VARCHAR(7) DEFAULT '#10B981';
ALTER TABLE restaurants ADD COLUMN theme_secondary_color VARCHAR(7) DEFAULT '#F59E0B';
```

#### Domain Management Table
```sql
CREATE TABLE restaurant_domains (
  id VARCHAR(191) PRIMARY KEY,
  restaurant_id VARCHAR(191) NOT NULL,
  domain_type ENUM('SUBDOMAIN', 'CUSTOM') NOT NULL,
  domain_value VARCHAR(100) NOT NULL UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  INDEX idx_domain_value (domain_value),
  INDEX idx_restaurant_id (restaurant_id)
);
```

## 🔧 Implementation Plan

### Phase 1: Core Infrastructure (Week 1-2)

#### 1.1 Database Schema Updates
- [ ] Add restaurant domain fields
- [ ] Create migration scripts
- [ ] Update Prisma schema
- [ ] Seed existing restaurants with subdomains

#### 1.2 Middleware Setup
- [ ] Create domain routing middleware
- [ ] Handle subdomain extraction
- [ ] Route to appropriate pages
- [ ] Error handling for invalid domains

#### 1.3 Restaurant Context Provider
- [ ] Create RestaurantProvider
- [ ] Load restaurant data by domain
- [ ] Handle suspension status
- [ ] Theme customization

### Phase 2: Restaurant-Specific Pages (Week 3-4)

#### 2.1 Restaurant Landing Page
- [ ] `/restaurant/[subdomain]/page.tsx`
- [ ] Custom branding per restaurant
- [ ] Restaurant-specific menu display
- [ ] Order system scoped to restaurant

#### 2.2 Restaurant Admin Panel
- [ ] Domain management interface
- [ ] Theme customization
- [ ] Suspension appeals
- [ ] Analytics dashboard

#### 2.3 Cart & Checkout Updates
- [ ] Scope cart to current restaurant
- [ ] Prevent cross-restaurant ordering
- [ ] Restaurant-specific pricing
- [ ] Delivery zones per restaurant

### Phase 3: Admin Control System (Week 5-6)

#### 3.1 Super Admin Dashboard
- [ ] Restaurant suspension/activation
- [ ] Domain management
- [ ] Global analytics
- [ ] System monitoring

#### 3.2 Suspension System
- [ ] Suspension reasons management
- [ ] Automated notifications
- [ ] Appeal process
- [ ] Reinstatement workflow

#### 3.3 Domain Management
- [ ] Subdomain validation
- [ ] Custom domain verification
- [ ] SSL certificate management
- [ ] DNS configuration guides

### Phase 4: Advanced Features (Week 7-8)

#### 4.1 Restaurant Themes
- [ ] Color customization
- [ ] Logo/branding upload
- [ ] Layout options
- [ ] Custom CSS support

#### 4.2 SEO & Marketing
- [ ] Restaurant-specific meta tags
- [ ] Structured data markup
- [ ] Social media integration
- [ ] Google Business integration

#### 4.3 Analytics & Reporting
- [ ] Restaurant-specific analytics
- [ ] Performance comparisons
- [ ] Revenue tracking
- [ ] Customer insights

## 🚀 Technical Implementation

### File Structure Changes
```
src/
├── app/
│   ├── (main)/                    # Main corgigo.com site
│   ├── admin/                     # Admin dashboard
│   ├── restaurant/
│   │   └── [subdomain]/           # Restaurant-specific pages
│   │       ├── page.tsx           # Restaurant home
│   │       ├── menu/page.tsx      # Restaurant menu
│   │       ├── cart/page.tsx      # Restaurant cart
│   │       └── layout.tsx         # Restaurant layout
│   └── api/
│       ├── restaurants/
│       │   └── [subdomain]/       # Restaurant-specific APIs
│       └── admin/
│           └── domains/           # Domain management APIs
├── components/
│   ├── restaurant/                # Restaurant-specific components
│   └── admin/                     # Admin components
├── contexts/
│   ├── RestaurantContext.tsx      # Current restaurant context
│   └── DomainContext.tsx          # Domain context
└── middleware.ts                  # Domain routing logic
```

### Key Components

#### 1. Domain Middleware
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];

  // Admin routes
  if (subdomain === 'admin') {
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Restaurant routes
  if (subdomain !== 'www' && subdomain !== 'corgigo') {
    url.pathname = `/restaurant/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

#### 2. Restaurant Context
```typescript
// contexts/RestaurantContext.tsx
interface RestaurantContextType {
  restaurant: Restaurant | null;
  isLoading: boolean;
  isSuspended: boolean;
  theme: RestaurantTheme;
  subdomain: string;
}

export function RestaurantProvider({ 
  children, 
  subdomain 
}: {
  children: React.ReactNode;
  subdomain: string;
}) {
  // Load restaurant data by subdomain
  // Handle suspension status
  // Provide theme configuration
}
```

#### 3. Admin Dashboard
```typescript
// app/admin/restaurants/page.tsx
export default function RestaurantsManagement() {
  return (
    <AdminLayout>
      <RestaurantList />
      <SuspensionManager />
      <DomainManager />
      <AnalyticsDashboard />
    </AdminLayout>
  );
}
```

## 🛡️ Security Considerations

### Access Control
- Restaurant owners can only access their own data
- Admin users have full system access
- API endpoints validate domain ownership
- Session scoping per domain

### Data Isolation
- Database queries filtered by restaurant
- Cart isolation per restaurant
- Order history scoped to restaurant
- Customer data protection

## 📊 Benefits

### For Restaurants
1. **Independent Branding** - Own web presence
2. **Better SEO** - Restaurant-specific URLs
3. **Customer Focus** - No competitor visibility
4. **Custom Experience** - Tailored themes and layouts

### For Customers
1. **Focused Experience** - Single restaurant focus
2. **Better Performance** - Faster loading
3. **Brand Recognition** - Memorable URLs
4. **Simplified Ordering** - No restaurant switching

### For Platform
1. **Scalability** - Easy to add new restaurants
2. **Control** - Granular management capabilities
3. **Revenue** - Per-restaurant billing potential
4. **Analytics** - Better insights per restaurant

## 🚨 Challenges & Solutions

### Challenge 1: DNS Management
**Solution:** Automated subdomain creation with fallback to path-based routing

### Challenge 2: SSL Certificates
**Solution:** Wildcard SSL for subdomains, Let's Encrypt for custom domains

### Challenge 3: SEO Impact
**Solution:** Proper 301 redirects, sitemap management, canonical URLs

### Challenge 4: Session Management
**Solution:** Domain-specific sessions with shared authentication

## 📈 Migration Strategy

### Phase 1: Parallel System
- Keep existing system running
- Add subdomain routing alongside
- Gradual restaurant migration

### Phase 2: Data Migration
- Assign subdomains to existing restaurants
- Update user preferences
- Migrate order history

### Phase 3: Full Cutover
- Redirect old URLs to new subdomains
- Update marketing materials
- Train restaurant staff

## 🔍 Testing Strategy

### Unit Tests
- Domain extraction logic
- Restaurant context loading
- Suspension status handling

### Integration Tests
- End-to-end ordering flow
- Admin suspension workflow
- Domain routing accuracy

### Performance Tests
- Page load times per restaurant
- Database query optimization
- Concurrent subdomain handling

## 📋 Success Metrics

### Technical Metrics
- Page load time < 2 seconds
- 99.9% uptime per restaurant
- Domain resolution < 100ms

### Business Metrics
- Restaurant satisfaction score
- Customer retention per restaurant
- Admin efficiency improvements

## 🎉 Launch Plan

### Pre-launch (2 weeks)
- Beta testing with select restaurants
- Staff training
- Documentation completion

### Launch (1 week)
- Gradual rollout (10% → 50% → 100%)
- Monitoring and hotfixes
- Customer communication

### Post-launch (Ongoing)
- Performance monitoring
- Feature enhancements
- Expansion planning 