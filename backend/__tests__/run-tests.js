#!/usr/bin/env node

/**
 * Script pour exécuter tous les tests unitaires du backend
 * Usage: node run-tests.js [--watch] [--coverage] [--verbose]
 */

const { spawn } = require('child_process');
const path = require('path');

// Configuration des arguments
const args = process.argv.slice(2);
const watch = args.includes('--watch');
const coverage = args.includes('--coverage');
const verbose = args.includes('--verbose');

// Construction de la commande Jest
let jestCommand = 'npx';
let jestArgs = ['jest'];

if (watch) {
    jestArgs.push('--watch');
}

if (coverage) {
    jestArgs.push('--coverage');
    jestArgs.push('--coverageReporters=text');
    jestArgs.push('--coverageReporters=html');
}

if (verbose) {
    jestArgs.push('--verbose');
}

// Ajout des patterns de fichiers à tester
jestArgs.push('--testPathPattern=__tests__');
jestArgs.push('--testNamePattern="🔐|🎯|💬|👥|🔧"'); // Filtre par emoji pour les tests principaux

console.log('🧪 Démarrage des tests unitaires du backend...');
console.log(`📁 Répertoire: ${__dirname}`);
console.log(`⚙️  Configuration: ${watch ? 'Watch' : 'One-time'} | ${coverage ? 'Avec couverture' : 'Sans couverture'}`);
console.log('');

// Exécution des tests
const testProcess = spawn(jestCommand, jestArgs, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
});

testProcess.on('close', (code) => {
    console.log('');
    if (code === 0) {
        console.log('✅ Tous les tests sont passés avec succès !');
    } else {
        console.log(`❌ Certains tests ont échoué (code: ${code})`);
        process.exit(code);
    }
});

testProcess.on('error', (error) => {
    console.error('❌ Erreur lors de l\'exécution des tests:', error.message);
    process.exit(1);
}); 