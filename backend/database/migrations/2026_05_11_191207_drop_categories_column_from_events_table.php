<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     *  Supprime la colonne 'categories' obsolète
     * Cette colonne était utilisée avant la mise en place
     * de la relation many-to-many avec la table 'categories'
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('categories');
        });
    }

    /**
     *  Méthode inverse : recrée la colonne si on rollback
     * Le type exact dépend de ce qu'elle était avant
     * (TEXT par sécurité, peut être JSON ou STRING selon ton cas)
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->text('categories')->nullable();
        });
    }
};