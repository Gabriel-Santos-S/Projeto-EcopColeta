import { createClient } from 'redis';

const redis = createClient();

redis.connect();

redis.on('connect', () => {
    console.log('🟢 Redis conectado!');
});
redis.on('error', (err) => console.error('🔴 Redis error:', err));

export default redis;