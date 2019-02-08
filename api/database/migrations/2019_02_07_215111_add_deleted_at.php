<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDeletedAt extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_deleted');
            $table->softDeletes();
        });
        Schema::table('scorings', function (Blueprint $table) {
            $table->dropColumn('is_deleted');
            $table->softDeletes();
        });
        Schema::table('words', function (Blueprint $table) {
            $table->dropColumn('is_deleted');
            $table->softDeletes();
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('is_deleted');
            $table->softDeletes();
        });
        Schema::table('matches', function (Blueprint $table) {
            $table->dropColumn('is_deleted');
            $table->softDeletes();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_deleted')->nullable();
            $table->dropSoftDeletes();
        });
        Schema::table('scorings', function (Blueprint $table) {
            $table->boolean('is_deleted')->nullable();
            $table->dropSoftDeletes();
        });
        Schema::table('words', function (Blueprint $table) {
            $table->boolean('is_deleted')->nullable();
            $table->dropSoftDeletes();
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->boolean('is_deleted')->nullable();
            $table->dropSoftDeletes();
        });
        Schema::table('matches', function (Blueprint $table) {
            $table->boolean('is_deleted')->nullable();
            $table->dropSoftDeletes();
        });
    }
}
