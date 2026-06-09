const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/confirm", async (req, res) => {
    console.log("BOOKING ROUTE HIT");
    console.log("Request body:", req.body);

    try {
        const { email, tickets, bookingId, event } = req.body;

        if (!email || !tickets || !bookingId || !event) {
            console.log("Missing booking information");
            return res.status(400).json({
                message: "Missing booking information"
            });
        }

        const totalPrice = Number(event.price) * Number(tickets);

        const qrText = encodeURIComponent(
            `Booking ID: ${bookingId}, Event: ${event.title}, Tickets: ${tickets}`
        );

        const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrText}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"EventoGo" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `EventoGo Booking Confirmation - ${event.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
                    <h2>Thank you for booking through EventoGo!</h2>

                    <p>Your booking has been confirmed successfully.</p>

                    <h3>Booking Details</h3>

                    <p><strong>Booking ID:</strong> ${bookingId}</p>
                    <p><strong>Event:</strong> ${event.title}</p>
                    <p><strong>Category:</strong> ${event.category}</p>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Tickets:</strong> ${tickets}</p>
                    <p><strong>Total Price:</strong> ${totalPrice.toLocaleString()} EGP</p>

                    <h3>Your Entry QR Code</h3>

                    <p>
                        <a href="${qrImage}" target="_blank">
                            Click here to view your QR code
                        </a>
                    </p>

                    <p>Please show this QR code at the event entrance.</p>

                    <hr />

                    <p>EventoGo Team</p>
                </div>
            `
        });

        console.log("Booking email sent successfully");

        res.status(200).json({
            message: "Booking email sent successfully"
        });

    } catch (error) {
        console.log("Booking Email Error:", error.message);

        res.status(500).json({
            message: "Failed to send booking email"
        });
    }
});

module.exports = router;