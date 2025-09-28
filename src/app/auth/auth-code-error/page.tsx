import { redirect } from 'next/navigation';

export default function AuthCodeErrorRedirect() {
    // Redirect to the default English locale
    redirect('/en/auth/auth-code-error');
}
