// Firebase Configuration - REPLACE WITH YOUR OWN CONFIG
const firebaseConfig = {
    const firebaseConfig = {
  apiKey: "AIzaSyDUMMY_API_KEY_123456",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Set persistence to LOCAL (keeps users logged in)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch((error) => {
        console.error("Error setting persistence:", error);
    });

// DOM Elements
const loginTab = document.querySelector('[data-tab="login"]');
const signupTab = document.querySelector('[data-tab="signup"]');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const resetForm = document.getElementById('reset-form');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const resetBtn = document.getElementById('reset-btn');
const googleLoginBtn = document.getElementById('google-login-btn');
const googleSignupBtn = document.getElementById('google-signup-btn');
const forgotPasswordLink = document.getElementById('forgot-password');
const backToLoginLink = document.getElementById('back-to-login');
const authSwitchLinks = document.querySelectorAll('.auth-switch-link');
const resetSuccess = document.getElementById('reset-success');
const successMessage = document.getElementById('success-message');

// Check if device is mobile
function isMobileDevice() {
    return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Check authentication state on page load
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is logged in
        if (user.emailVerified || user.providerData[0]?.providerId === 'google.com') {
            // Email is verified or Google user - redirect to dashboard
            showSuccessMessage('You are already logged in. Redirecting to dashboard...');
            setTimeout(() => {
                window.location.href = '#';
                // window.location.href = '../dashboard/index.html';
            }, 2000);
        } else {
            // Email is not verified
            showSuccessMessage('Please verify your email. Check your inbox for the verification link.');
        }
    }
});

// Tab Switching
loginTab.addEventListener('click', () => switchTab('login'));
signupTab.addEventListener('click', () => switchTab('signup'));

// Auth Switch Links
authSwitchLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('data-switch');
        switchTab(target);
    });
});

// Forgot Password
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    showResetForm();
});

// Back to Login
backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('login');
});

function switchTab(tab) {
    // Update tabs
    loginTab.classList.toggle('active', tab === 'login');
    signupTab.classList.toggle('active', tab === 'signup');
    
    // Show/hide forms
    loginForm.classList.toggle('active', tab === 'login');
    signupForm.classList.toggle('active', tab === 'signup');
    resetForm.classList.remove('active');
    
    // Clear messages
    clearMessages();
    clearAllErrors();
}

function showResetForm() {
    // Hide all auth forms
    loginForm.classList.remove('active');
    signupForm.classList.remove('active');
    resetForm.classList.add('active');
    
    // Clear messages
    clearMessages();
    clearAllErrors();
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    document.querySelectorAll('.form-input').forEach(el => {
        el.classList.remove('error');
    });
}

function clearMessages() {
    successMessage.classList.remove('show');
    successMessage.textContent = '';
    resetSuccess.classList.remove('active');
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(`${inputId}-error`);
    
    if (input && errorEl) {
        input.classList.add('error');
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(`${inputId}-error`);
    
    if (input && errorEl) {
        input.classList.remove('error');
        errorEl.classList.remove('show');
    }
}

function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.classList.add('show');
    
    // Auto-hide success messages after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

function setLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.classList.add('loading');
        button.innerHTML = `<span class="loading-spinner"></span> Processing...`;
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        
        if (button.id === 'login-btn') {
            button.textContent = 'Login';
        } else if (button.id === 'signup-btn') {
            button.textContent = 'Create Account';
        } else if (button.id === 'reset-btn') {
            button.textContent = 'Send Reset Link';
        }
        
        button.disabled = false;
    }
}

// Email/Password Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Basic validation
    if (!email) {
        showError('login-email', 'Email is required');
        return;
    }
    
    if (!password) {
        showError('login-password', 'Password is required');
        return;
    }
    
    clearError('login-email');
    clearError('login-password');
    clearMessages();
    
    setLoading(loginBtn, true);
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (user.emailVerified) {
            // Email is verified - redirect to dashboard
            showSuccessMessage('Login successful');
            setTimeout(() => {
                window.location.href = '#';
                // window.location.href = '../dashboard/index.html';
            }, 1500);
        } else {
            // Email is not verified
            showSuccessMessage('Please verify your email before logging in. Check your inbox for the verification link.');
            // Sign out the user
            await auth.signOut();
        }
    } catch (error) {
        console.error('Login error:', error);
        
        // User-friendly error messages
        let errorMessage = 'An error occurred during login.';
        
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                showError('login-email', errorMessage);
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled.';
                showError('login-email', errorMessage);
                break;
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email.';
                showError('login-email', errorMessage);
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                showError('login-password', errorMessage);
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                showError('login-password', errorMessage);
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                showError('login-email', errorMessage);
                break;
            default:
                showError('login-email', errorMessage);
        }
    } finally {
        setLoading(loginBtn, false);
    }
});

// Email/Password Sign Up
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validation
    if (!email) {
        showError('signup-email', 'Email is required');
        return;
    }
    
    if (!password) {
        showError('signup-password', 'Password is required');
        return;
    }
    
    if (password.length < 6) {
        showError('signup-password', 'Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('signup-confirm-password', 'Passwords do not match');
        return;
    }
    
    clearError('signup-email');
    clearError('signup-password');
    clearError('signup-confirm-password');
    clearMessages();
    
    setLoading(signupBtn, true);
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Send verification email
        await user.sendEmailVerification({
            url: window.location.origin + '/dashboard/index.html',
            handleCodeInApp: true
        });
        
        // Sign out the user (they need to verify email first)
        await auth.signOut();
        
        // Show success message
        showSuccessMessage('Verification email sent! Please check your inbox and verify your email before logging in.');
        
        // Clear the form
        document.getElementById('signupForm').reset();
        
        // Switch to login tab after 3 seconds
        setTimeout(() => {
            switchTab('login');
        }, 3000);
        
    } catch (error) {
        console.error('Sign up error:', error);
        
        let errorMessage = 'An error occurred during sign up.';
        
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                showError('signup-email', errorMessage);
                break;
            case 'auth/email-already-in-use':
                errorMessage = 'An account with this email already exists.';
                showError('signup-email', errorMessage);
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak. Please choose a stronger password.';
                showError('signup-password', errorMessage);
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password accounts are not enabled.';
                showError('signup-email', errorMessage);
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                showError('signup-email', errorMessage);
                break;
            default:
                showError('signup-email', errorMessage);
        }
    } finally {
        setLoading(signupBtn, false);
    }
});

// Password Reset
document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reset-email').value.trim();
    
    if (!email) {
        showError('reset-email', 'Email is required');
        return;
    }
    
    clearError('reset-email');
    clearMessages();
    
    setLoading(resetBtn, true);
    
    try {
        await auth.sendPasswordResetEmail(email, {
            url: window.location.origin + '/auth/auth.html',
            handleCodeInApp: true
        });
        resetSuccess.classList.add('active');
        
        // Clear the form
        document.getElementById('resetPasswordForm').reset();
    } catch (error) {
        console.error('Reset password error:', error);
        
        let errorMessage = 'An error occurred. Please try again.';
        
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many requests. Please try again later.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
        }
        
        showError('reset-email', errorMessage);
    } finally {
        setLoading(resetBtn, false);
    }
});

// Unified Google Authentication function
async function handleGoogleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Add scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    // Set custom parameters
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    
    clearMessages();
    
    try {
        // Use redirect for mobile devices, popup for desktop
        if (isMobileDevice()) {
            // For mobile devices
            console.log('Using Google Sign-In with redirect (mobile device)');
            
            // Store the original URL to return to after auth
            sessionStorage.setItem('googleAuthRedirect', window.location.href);
            
            // Use signInWithRedirect
            await auth.signInWithRedirect(provider);
            
        } else {
            // For desktop devices
            console.log('Using Google Sign-In with popup (desktop)');
            
            const result = await auth.signInWithPopup(provider);
            const user = result.user;
            
            // Google accounts are already verified
            showSuccessMessage('Login successful! Redirecting to dashboard...');
            
            // Store user info in localStorage for the dashboard
            localStorage.setItem('userDisplayName', user.displayName || user.email);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userPhotoURL', user.photoURL || '');
            
            setTimeout(() => {
                window.location.href = '../dashboard/index.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Google auth error:', error);
        
        let errorMessage = 'An error occurred during Google sign in.';
        
        switch (error.code) {
            case 'auth/account-exists-with-different-credential':
                errorMessage = 'An account already exists with the same email address. Please log in with email/password.';
                break;
            case 'auth/popup-blocked':
                errorMessage = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
                break;
            case 'auth/popup-closed-by-user':
                // Don't show error if user closed the popup intentionally
                return;
            case 'auth/cancelled-popup-request':
                return;
            case 'auth/redirect-cancelled-by-user':
                return;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            case 'auth/unauthorized-domain':
                errorMessage = 'This domain is not authorized for Google Sign-In. Please contact support.';
                console.error('Unauthorized domain. Add your domain to Firebase Auth authorized domains.');
                break;
        }
        
        // Show error
        showSuccessMessage(errorMessage);
    }
}

// Handle redirect result when returning from Google sign-in
async function handleRedirectResult() {
    try {
        const result = await auth.getRedirectResult();
        
        if (result.user) {
            // Successful redirect sign-in
            const user = result.user;
            
            showSuccessMessage('Login successful! Redirecting to dashboard...');
            
            // Store user info in localStorage for the dashboard
            localStorage.setItem('userDisplayName', user.displayName || user.email);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userPhotoURL', user.photoURL || '');
            
            setTimeout(() => {
                window.location.href = '#';
                window.location.href = '../dashboard/index.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Redirect result error:', error);
        
        // Only show error if it's not a cancelled operation
        if (error.code !== 'auth/redirect-cancelled-by-user' && 
            error.code !== 'auth/popup-closed-by-user') {
            
            let errorMessage = 'An error occurred during Google sign in.';
            
            if (error.code === 'auth/account-exists-with-different-credential') {
                errorMessage = 'An account already exists with this email. Please sign in with your email and password first, then link your Google account.';
            }
            
            showSuccessMessage(errorMessage);
        }
    }
}

// Attach event listeners for Google buttons
googleLoginBtn.addEventListener('click', handleGoogleAuth);
googleSignupBtn.addEventListener('click', handleGoogleAuth);

// Check for redirect result on page load
document.addEventListener('DOMContentLoaded', () => {
    // Handle redirect result if this is a return from Google auth
    handleRedirectResult();
    
    // Check if we have a pending redirect in sessionStorage
    const pendingRedirect = sessionStorage.getItem('pendingGoogleAuth');
    if (pendingRedirect) {
        sessionStorage.removeItem('pendingGoogleAuth');
        handleRedirectResult();
    }
});

// Real-time input validation
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
        const inputId = input.id;
        clearError(inputId);
        
        // Additional validation for password match
        if (inputId === 'signup-password' || inputId === 'signup-confirm-password') {
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            if (password && confirmPassword && password !== confirmPassword) {
                showError('signup-confirm-password', 'Passwords do not match');
            }
        }
        
        // Email format validation
        if (inputId.includes('email') && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(inputId, 'Please enter a valid email address');
            }
        }
    });
    
    // Add focus/blur events for better UX
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeForm = document.querySelector('.auth-form.active');
        if (activeForm) {
            const submitBtn = activeForm.querySelector('.primary-btn');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            }
        }
    }
    
    // Escape to clear errors/messages
    if (e.key === 'Escape') {
        clearAllErrors();
        clearMessages();
    }
});

// Detect online/offline status
window.addEventListener('online', () => {
    showSuccessMessage('You are back online!');
});

window.addEventListener('offline', () => {
    showSuccessMessage('You are offline. Please check your internet connection.');
});

// Demo notification
console.log('Speedle Authentication System Loaded');
console.log('Make sure to replace Firebase config with your own project credentials.');

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isMobileDevice,
        handleGoogleAuth,
        handleRedirectResult
    };

}
