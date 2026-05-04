<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Réinitialisation de mot de passe</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f5f5f5;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
        }
        .content {
            padding: 20px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff !important;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #888;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #f5f5f5;
        }
        .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .link-fallback {
            background-color: #f3f4f6;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            word-break: break-all;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌍 Luxafro</h1>
        </div>

        <div class="content">
            <h2>Bonjour {{ $user->name }} 👋</h2>

            <p>
                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.
            </p>

            <p>
                Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :
            </p>

            <div style="text-align: center;">
                <a href="{{ $resetLink }}" class="button">
                    Réinitialiser mon mot de passe
                </a>
            </div>

            <div class="warning">
                <strong>⚠️ Important :</strong>
                Ce lien expire dans <strong>1 heure</strong> pour des raisons de sécurité.
            </div>

            <p>
                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
                Votre mot de passe restera inchangé.
            </p>

            <p style="margin-top: 30px;">
                Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :
            </p>

            <div class="link-fallback">
                {{ $resetLink }}
            </div>
        </div>

        <div class="footer">
            <p>
                Cet email vous a été envoyé par <strong>Luxafro</strong><br>
                Plateforme culturelle camerounaise
            </p>
            <p>
                © {{ date('Y') }} Luxafro. Tous droits réservés.
            </p>
        </div>
    </div>
</body>
</html>