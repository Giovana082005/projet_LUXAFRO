<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
        $table->id();

        $table->string('nom');
        $table->text('description');

        $table->date('date');
        $table->time('horaire');

        $table->string('lieu');

        $table->json('categories');

        $table->boolean('pour_enfant')->default(false);

        $table->integer('nombre_participants')->nullable();

        $table->decimal('tarif', 8, 2)->nullable();

        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
