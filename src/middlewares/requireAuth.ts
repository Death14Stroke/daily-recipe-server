import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export default async (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;

    if (!authorization)
		return res.status(401).send({ error: 'You must be logged in' });

	const token = authorization.replace('Bearer ', '');

	try {
		const { uid } = await admin.auth().verifyIdToken(token);
		req.uid = uid;
        next();
	} catch (err) {
		return res.status(401).send({ error: 'Invalid token' });
	}
};
