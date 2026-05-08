<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('event_id')->constrained()->onDelete('cascade');

            $table->integer('nb_adultes')->default(1);
            $table->integer('nb_enfants')->default(0);

            $table->decimal('total_price', 8, 2)->nullable();

            $table->enum('status', [
                'pending',
                'confirmed',
                'cancelled'
            ])->default('pending');

            $table->enum('payment_method', [
                'free',
                'on_site',
                'qr_code'
            ])->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
