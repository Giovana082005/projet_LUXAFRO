<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::table('events', function (Blueprint $table) {
        $table->renameColumn('horaire', 'heure_debut');
        $table->time('heure_fin')->nullable()->after('heure_debut');
    });
}

public function down()
{
    Schema::table('events', function (Blueprint $table) {
        $table->renameColumn('heure_debut', 'horaire');
        $table->dropColumn('heure_fin');
    });
}
};
