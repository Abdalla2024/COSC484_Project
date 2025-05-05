import { Link } from 'react-router-dom';

function VerifyPage() {
    return (
        <div>
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-md mx-4 space-y-8 p-8 bg-white rounded-lg shadow-md border border-gray-200">
                    <div>
                        <h2 className="text-left text-3xl font-extrabold text-gray-700">
                            Please verify your email via an authentication link! Check spam also!
                        </h2>
                        <br />
                        <p className="text-md text-gray-600">
                            Need to create an account?{' '}
                            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Signup
                            </Link>
                        </p>
                        <p className="text-md text-gray-600">
                            Already have an account?{' '}
                            <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default VerifyPage;