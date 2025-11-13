import AuditLog from '../models/auditLog.model.js';

export const auditLog = (action, entity) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to capture response
    res.json = function (data) {
      // Log after response is sent
      setImmediate(async () => {
        try {
          if (req.user) {
            await AuditLog.create({
              action,
              entity,
              entityId: req.params.id || data?._id || data?.id,
              changes: req.method !== 'GET' ? req.body : undefined,
              performedBy: req.user._id,
              ipAddress: req.ip || req.connection.remoteAddress,
              userAgent: req.get('user-agent'),
            });
          }
        } catch (error) {
          console.error('Audit log error:', error);
        }
      });
      
      return originalJson(data);
    };
    
    next();
  };
};



