"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const app = express();
app.use((0, cors_1.default)({
    origin: "*", // Bu geçici olarak tüm kaynaklara izin verir. Güvenlik açısından gerçek ortamda uygun bir URL belirtin.
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", (0, cors_1.default)());
