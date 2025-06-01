/**
 * Middleware to restrict access based on user roles
 * @param roles Array of allowed roles
 * @returns Express middleware function
 */
export const restrictTo = (roles) => {
    return (req, res, next) => {
        try {
            // Check if user exists and has a role
            if (!req.user) {
                return res.status(401).json({
                    message: 'Authentication required'
                });
            }
            // Check if user's role is allowed
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: 'You do not have permission to perform this action',
                    required: roles,
                    current: req.user.role
                });
            }
            next();
        }
        catch (error) {
            res.status(500).json({
                message: 'Error checking permissions'
            });
        }
    };
};
