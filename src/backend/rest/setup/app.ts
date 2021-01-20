import express from 'express';
import setupMiddleware from './middleware';
import setupRoute from './route';
import setupLogger from './logger';
import setupSwagger from './swagger';
// import handlingNotfound from './notFound';

const app = express();

setupSwagger(app);
setupMiddleware(app);
setupLogger(app);
setupRoute(app);
// handlingNotfound(app);

export default app;