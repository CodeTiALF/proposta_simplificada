<?php
header('Content-Type: application/json');

// Prevenir erros de CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Se for uma requisição OPTIONS (preflight), retornar apenas os headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar se é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit();
}

// Receber dados do POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos']);
    exit();
}

// Nome do arquivo de log
$logFile = __DIR__ . '/logs.json';

// Verificar permissões
if (file_exists($logFile)) {
    if (!is_writable($logFile)) {
        http_response_code(500);
        echo json_encode(['error' => 'Arquivo de log sem permissão de escrita']);
        exit();
    }
} else {
    if (!is_writable(__DIR__)) {
        http_response_code(500);
        echo json_encode(['error' => 'Diretório sem permissão de escrita']);
        exit();
    }
}

// Carregar logs existentes
$logs = [];
if (file_exists($logFile)) {
    $jsonContent = file_get_contents($logFile);
    if ($jsonContent) {
        $logs = json_decode($jsonContent, true) ?? [];
    }
}

// Adicionar novo log
$logs[] = $data;

// Salvar logs atualizados
if (file_put_contents($logFile, json_encode($logs, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao salvar log']);
}