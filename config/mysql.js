const env = function (name, fallback) {
  return process.env[name] || fallback;
};

module.exports.MYSQL_HOST = env('MYSQL_HOST', '127.0.0.1');
module.exports.MYSQL_PORT = Number(env('MYSQL_PORT', '3306'));
module.exports.MYSQL_USER = env('MYSQL_USER', 'root');
module.exports.MYSQL_PSW = process.env.MYSQL_PASSWORD || env('MYSQL_PSW', 'Cab230!');
module.exports.MYSQL_DB = env('MYSQL_DB', 'movies');
