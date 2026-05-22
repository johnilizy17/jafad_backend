# MongoDB Connection Troubleshooting Guide

## Common Issues and Solutions

### 1. ENOTFOUND Error (DNS Resolution Failed)

**Error Message:**
```
Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.ng3gq.mongodb.net
```

**Possible Causes & Solutions:**

#### A. Internet Connection
- Check your internet connection
- Try accessing other websites to verify connectivity
- Restart your router if needed

#### B. MongoDB Atlas Cluster Status
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Check if your cluster is running (not paused)
3. If paused, click "Resume" to restart it

#### C. IP Whitelist Configuration
1. Go to MongoDB Atlas Dashboard
2. Navigate to: **Network Access** → **IP Access List**
3. Add your current IP address or use `0.0.0.0/0` for testing (allow all IPs)
   - **Note:** `0.0.0.0/0` allows access from anywhere - use only for development

#### D. DNS Issues
- Try using Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1)
- Flush your DNS cache:
  ```bash
  # Windows
  ipconfig /flushdns
  
  # Mac/Linux
  sudo dscacheutil -flushcache
  ```

#### E. Firewall/Antivirus
- Temporarily disable firewall/antivirus to test
- Add Node.js to firewall exceptions if needed

### 2. Connection String Issues

**Current Connection String Format:**
```
mongodb+srv://username:password@cluster0.ng3gq.mongodb.net/database?retryWrites=true&w=majority
```

**Important:**
- Database name must be included (e.g., `/jafad`)
- Special characters in password must be URL-encoded
- Use `mongodb+srv://` for Atlas clusters (not `mongodb://`)

### 3. Authentication Errors

If you see authentication errors:
1. Verify username and password in MongoDB Atlas
2. Go to: **Database Access** → Check user credentials
3. Ensure user has proper permissions (readWrite role)

### 4. Deprecated Options Warning

The following options are no longer needed in MongoDB Driver v4+:
- ~~`useNewUrlParser: true`~~ (removed)
- ~~`useUnifiedTopology: true`~~ (removed)

These have been removed from the updated code.

## Quick Fix Checklist

- [ ] Internet connection is working
- [ ] MongoDB Atlas cluster is running (not paused)
- [ ] IP address is whitelisted in Network Access
- [ ] Database name is included in connection string
- [ ] Username and password are correct
- [ ] User has proper database permissions
- [ ] Firewall is not blocking MongoDB connections

## Testing Connection

After making changes, restart your server:

```bash
cd jafad_backend
npm start
```

Look for this success message:
```
✓ MongoDB Connected Successfully
✓ Server is running on port: 4000
```

## Still Having Issues?

1. Check MongoDB Atlas status page: https://status.mongodb.com
2. Try connecting with MongoDB Compass using the same connection string
3. Contact MongoDB support or check their documentation

## Environment Variables

Make sure your `.env` file contains:

```env
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
PORT = 4000
NODE_ENV = development
```
