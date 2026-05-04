<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $resetLink;

    /**
     * Constructeur du Mailable
     */
    public function __construct(User $user, string $resetLink)
    {
        $this->user = $user;
        $this->resetLink = $resetLink;
    }

    /**
     * Configuration de l'enveloppe (sujet, expéditeur)
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🔐 Réinitialisation de votre mot de passe Luxafro',
        );
    }

    /**
     * Configuration du contenu
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.password-reset',
        );
    }
}